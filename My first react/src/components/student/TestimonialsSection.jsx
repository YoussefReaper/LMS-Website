import React, {useState} from 'react'
import {assets, dummyTestimonial} from '../../assets/assets'

const TestimonialsSection = () => {

  const [showUselessPanel, setShowUselessPanel] = useState();

  const showUselessPanelFunction = () => {
    setShowUselessPanel(!showUselessPanel)
  }

  return (
    <div className='pb-14 px-8 md:px-0'>
        <h2 className="text-3xl font-medium text-gray-800">Testimonials</h2>
        <p className="md:text-base text-gray-500 mt-3">Hear from our learners as they share their journeys of transformation, success, and how our <br /> platform has made a difference in their lives.</p>
        <span className='text-sm text-gray-200'>Not real, don't click Read more because...Well, you know</span>
        <div className='grid grid-cols-auto gap-8 mt-14'>
          {dummyTestimonial.map((testimonial, index) => (
            <div key={index} className='text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden'>
              <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
                <img className='h-12 w-12 rounded-full' src={testimonial.image} alt={testimonial.name} />
                <div>
                  <h1 className='text-lg front-medium text-gray-800'>{testimonial.name}</h1>
                  <p className='text-gray-800/80'>{testimonial.role}</p>
                </div>
              </div>
              <div className='p-5 pb-7'>
                  <div className='flex gap-0.5'>
                    {[...Array(5)].map((_, i)=>(
                      <img className="h-5" key={i} src={ i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} alt="star" />
                    ))}
                  </div>
                  <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
                </div>
                <a href='#' onClick={showUselessPanelFunction} className='text-red-500 underline px-5'>Read more</a>
                
            </div>
          ))}
          
        </div>
        {showUselessPanel && 
                <div className='flex flex-col items-center gap-4 w-full h-30 bg-white-500 border-gray-500/30 rounded-lg m-auto'>
                  <p className='p-5'>Of course there is no more dummy, they are all the same and not even real, I told you already!</p>
                </div>

                }
    </div>
  )
}
export default TestimonialsSection