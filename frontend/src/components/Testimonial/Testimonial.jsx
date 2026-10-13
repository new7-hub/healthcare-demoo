import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

import aaravAvatar from "../../assets/images/patient-aarav.svg"
import priyaAvatar from "../../assets/images/patient-priya.svg"
import rohanAvatar from "../../assets/images/patient-rohan.svg"
import ananyaAvatar from "../../assets/images/patient-ananya.svg"
import {HiStar} from 'react-icons/hi'

const Testimonial = () => {
  return (
    <div className="mt-[30px] lg:mt-[55px]">
        <Swiper 
            modules={[Pagination]} 
            spaceBetween={30} 
            slidesPerView={1} 
            pagination={{ clickable:true }}
            breakpoints={{ 
                640: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            }}
        >
            <SwiperSlide>
                <div className="py-[30px] px-5 rounded-3">
                    <div className="flex items-center gap-[13px]">
                        <img src={aaravAvatar} alt="Aarav Sharma" className="w-14 h-14 rounded-full object-cover" />
                        <div>
                            <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
                            Aarav Sharma
                            </h4>
                            <div className="flex items-center gap-[2px]">
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                            </div>
                        </div>
                    </div>

                    <p className="text-[16px] leading-7 text-textColor font-[400] ">
                        "I have taken medical services from them. They treat so well and
                        they are providing the best medical services."
                    </p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="py-[30px] px-5 rounded-3">
                    <div className="flex items-center gap-[13px]">
                        <img src={priyaAvatar} alt="Priya Patel" className="w-14 h-14 rounded-full object-cover" />
                        <div>
                            <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
                            Priya Patel
                            </h4>
                            <div className="flex items-center gap-[2px]">
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                            </div>
                        </div>
                    </div>

                    <p className="text-[16px] leading-7 text-textColor font-[400] ">
                        "I have taken medical services from them. They treat so well and
                        they are providing the best medical services."
                    </p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="py-[30px] px-5 rounded-3">
                    <div className="flex items-center gap-[13px]">
                        <img src={rohanAvatar} alt="Rohan Mehta" className="w-14 h-14 rounded-full object-cover" />
                        <div>
                            <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
                            Rohan Mehta
                            </h4>
                            <div className="flex items-center gap-[2px]">
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                            </div>
                        </div>
                    </div>

                    <p className="text-[16px] leading-7 text-textColor font-[400] ">
                        "I have taken medical services from them. They treat so well and
                        they are providing the best medical services."
                    </p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="py-[30px] px-5 rounded-3">
                    <div className="flex items-center gap-[13px]">
                        <img src={ananyaAvatar} alt="Ananya Shah" className="w-14 h-14 rounded-full object-cover" />
                        <div>
                            <h4 className="text-[18px] leading-[30px] font-semibold text-headingColor">
                            Ananya Shah
                            </h4>
                            <div className="flex items-center gap-[2px]">
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                                <HiStar className="text-yellowColor w-[18px] h-5" />
                            </div>
                        </div>
                    </div>

                    <p className="text-[16px] leading-7 text-textColor font-[400] ">
                        "I have taken medical services from them. They treat so well and
                        they are providing the best medical services."
                    </p>
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
  )
}

export default Testimonial