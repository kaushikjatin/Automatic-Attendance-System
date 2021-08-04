import React from 'react';
import './Creator-card.styles.scss';
import VanillaTilt from 'vanilla-tilt';


class CreatorCardItem extends React.Component
{
    constructor() {
        super();
        this.myRef = React.createRef();
      }

    componentDidMount()
    {
        const node = this.myRef.current;
        VanillaTilt.init(node,{max:25 , speed:200})      
    }

    render()
    {

        const {name,imageUrl,PhoneNo}=this.props;
        return(
            <div className='box' ref={this.myRef}>
                <div className='name'>{name}</div>
                <img className ='creator' src={imageUrl}></img>
                <div className='phone-no'>{PhoneNo}</div>
            </div>
        )
    }
}


export default CreatorCardItem;