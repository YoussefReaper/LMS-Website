import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body.toString("utf8");

    const evt = whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = evt;

    if (type === "user.created" || type === "user.updated") {
      const email = data.email_addresses?.[0]?.email_address ?? "";
      const first = data.first_name ?? "";
      const last = data.last_name ?? "";
      const name = `${first} ${last}`.trim();

      const userData = {
        _id: data.id,
        email,
        name,
        imageUrl: data.image_url,
      };

      if (type === "user.created") await User.create(userData);
      else await User.findByIdAndUpdate(data.id, userData, { new: true });

      return res.json({ ok: true });
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
      return res.json({ ok: true });
    }

    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });

        const session = sessions.data[0];
        if (!session?.metadata?.purchaseId) break;

        const { purchaseId } = session.metadata;

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) break;

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId);

        if (!userData || !courseData) break;

        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        if (!userData.enrolledCourses.includes(courseData._id)) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        purchaseData.status = "completed";
        await purchaseData.save();

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });

        const session = sessions.data[0];
        if (!session?.metadata?.purchaseId) break;

        const { purchaseId } = session.metadata;

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) break;

        purchaseData.status = "failed";
        await purchaseData.save();

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Stripe handler error:", error);
    return res.status(500).json({ received: false });
  }
};
