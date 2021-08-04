import React, { useState } from "react";
import {RangeSelector} from "../../Components/RangeSelector";
import photo from '../college.png'
import devansh from '../devansh.jpg'
import jatin from '../jatin.jpg'
import './HomePage.styles.scss'
import CreatorCardItem from '../../Components/Creator-card/Creator-card.component'



const HomePage = () => {
  const features=[
    'Significantly improves efficiency of class by reducing the attendance time',
    'Reduces the chances of proxy to 0%',
    'Make your organisation free from hactic attendance registers',
    'Allow Students to see their daily attendance and sends mail to every absentees',
    'Allow teachers to see various insights about the attendance of students',
    'Support multiple department,multiple branches and multiple sections'
  ];
  const creater=[{name:'Devansh Goyal',image:devansh,phoneNo:'9416749221'},{name:'Jatin Kaushik',image:jatin,phoneNo:'8168791049'}];
  return(

    <div className='homepage-content'>


          <div className='college-info'>
            <img src={photo}  width='300px' alt='logo'/>
            <h1>DCRUST(Murthal)</h1>
          </div>
          

          <div className='features-block'>
                    <h1 className='features-heading'>Features we provide</h1>
                    <div className='feature-list'>
                    <ul>
                        {features.map((feat,idx)=>{
                            return <li className='feature'>{feat}</li>
                        })}
                    </ul>
                    </div>
          </div>
      

          <div className='Creators-info'>
              <h1>Creater of the app</h1>
              <div className='creator-personal-info'>
                  {creater.map((person,idx) =>(
                    <CreatorCardItem key={idx} name={person.name} imageUrl={person.image} PhoneNo={person.phoneNo}></CreatorCardItem>
                    )
                  )}
              </div>
          </div>
    </div>
  );
};

export default HomePage;
