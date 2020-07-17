import React from 'react';

const style = {
    height: 50,
    width: 50
}

const Button = (props) => {
    return (
        <input
            type="button"
            className={props.type === 'action' ? 'button action-button' : 'button input-button'}
            onClick={props.handleClick}
            value={props.label}
            style={style}
        />
    );
}

export default Button;