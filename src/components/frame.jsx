import React from 'react';
import Screen from './screen';
import Button from './button';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

//const client = new W3CWebSocket('ws://localhost:8000'); //the server you talk to
const client = new W3CWebSocket('wss://socketed-calculator.vercel.app/:8000'); //the server you talk to


const style = {
    //style="width: 50%; margin: 0 auto;
    position: 'absolute', left: '40%', top: '10%',
     //display: 'flex',
     alignItems: 'center',
     justifyContent: 'center'
}



function DisplayLogs(props) {
    var date = new Date();
    console.log('inside display, props is ',props);
    console.log('inside display, props.logs is ',props.logs);
    const logs = props.logs;
    const listItems = logs.map((log) =>
      <div key={log.toString()+date.getMilliseconds()}>{log}</div>
    );
    return (
      <div>{listItems}</div>
    );
}

class Frame extends React.Component {
    constructor() {
        super();
        this.state = {
            question: '0',
            answer: '0',
            userName: '',
            logs: [],
            numbers: [1, 2, 3, 4, 5]
        }
        this.handleClick = this.handleClick.bind(this);

        

    }

    componentDidMount() {
        console.log(this.state.logs)
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            console.log(message.data);
            
            const dataFromServer = JSON.parse(message.data);
            console.log('got reply! ', dataFromServer);
            

            if(dataFromServer.hasOwnProperty('msg')){
                console.log('got reply! ', dataFromServer.msg);
                console.log('this.state.logs before push: ',this.state.logs);
                var logsNew = this.state.logs;
                logsNew.push(dataFromServer.msg);
                console.log('logsnew is ',logsNew);
                if (logsNew.length > 10) logsNew = logsNew.slice(-10);
                this.setState({logs: logsNew});
                console.log(this.state.logs)    
            }
            else {
                console.log('received userID! ', message.data);  
                this.setState({userName: JSON.parse(message.data).id});
            }
            
        };

        

    }
    
    render() {
        return (
            <div className="frame" style={style}>
                <h2 className="calculator-title">
                    ** WS calculator **
                </h2>
                <div>
                    Open as many tabs to this link as you want and see the magic!
                </div>
                <div>You are logged in as {this.state.userName}</div>
                <br></br>
                <Screen question={this.state.question} answer={this.state.answer} />
                <div className="button-row">
                    <Button label={'1'} handleClick={this.handleClick} type='input' />
                    <Button label={'2'} handleClick={this.handleClick} type='input' />
                    <Button label={'3'} handleClick={this.handleClick} type='input' />
                    <Button label={'4'} handleClick={this.handleClick} type='input' /> 
                    <Button label={'-'} handleClick={this.handleClick} type='action' />
                    <Button label={'+'} handleClick={this.handleClick} type='action' />
                </div>
                
                <div className="button-row">
                    <Button label={'5'} handleClick={this.handleClick} type='input' />
                    <Button label={'6'} handleClick={this.handleClick} type='input' />
                    <Button label={'7'} handleClick={this.handleClick} type='input' />
                    <Button label={'8'} handleClick={this.handleClick} type='input' /> 
                    <Button label={'*'} handleClick={this.handleClick} type='action' />
                    <Button label={'/'} handleClick={this.handleClick} type='action' />
                </div>
                <div className="button-row">
                    <Button label={'9'} handleClick={this.handleClick} type='input' />
                    <Button label={'.'} handleClick={this.handleClick} type='input' />
                    <Button label={'0'} handleClick={this.handleClick} type='input' /> 
                    <Button label={'C'} handleClick={this.handleClick} type='action' />
                    <Button label={'='} handleClick={this.handleClick} type='action' />
                </div>
                <div className="logs">
                    <p>Logs:</p>
                    <DisplayLogs logs={this.state.logs}/>
                </div>
            </div>
        );
    }

    //define a handleclick method residing in this class, for use by various buttons as they wish
    handleClick(event) {
        const value = event.target.value; //is basically getting the 'label' attribute
        switch(value) {
            case '=': { //missing curly braces!
                var answer;
                try {
                    answer = eval(this.state.question).toString();
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        alert(e.message);
                        this.setState({question: ''});
                        this.setState({answer: ''});
                        break;
                    }
                }
                //const answer = eval(this.state.question).toString();
                this.setState({answer});
                
                var mObj = JSON.stringify({
                    type: "message",
                    msg: 'user <'+this.state.userName+'> performed '+this.state.question+' = '+answer,
                    //user:  this.state.userName
                  })

                client.send(mObj);
                this.setState({question: ''});
                this.setState({answer: ''});
                break;
            }
            case 'C':{
                this.setState({question:'',answer:''});
                break;
            }
            default: {
                if (this.state.question === '0')
                    this.setState({question: value});
                else {
                    this.setState({question: this.state.question + value});
                }
                break;
            }
         }
    }
}

export default Frame;
