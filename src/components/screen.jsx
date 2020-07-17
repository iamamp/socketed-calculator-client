import React from 'react';
import ScreenRow from './screenRow';

//this screen apparently contains the two screen rows
const Screen = (props) => {
    return (
        <div className="screen">
            <ScreenRow value={props.question} />
            <ScreenRow value={props.answer} />
        </div>
    );
}

export default Screen;