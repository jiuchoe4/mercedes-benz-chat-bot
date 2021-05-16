import React from 'react';
import axios from 'axios'
import { TextField} from '@material-ui/core'
import { withStyles } from "@material-ui/core/styles";
import './Chatbox.css'

import {BASE_URL} from '../Constants'

const styles = {
    root: {
      background: "white"
    },
    input: {
      color: "white"
    }
  };
  

class Chatbox extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            message: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
    }

    componentDidMount = async () => {
    }

    handleChange = input => e => {
        this.setState({[input]: e.target.value})
    }

    sendMessage(e){
        if(e.keyCode === 13)
        {
            const query = {
                "query": this.state.message
            }
            axios
                .post(BASE_URL, query)
                .then(response => {
                    const newResponse = { 
                        data: response.data.data,
                        WrittenResponse: response.data.WrittenResponse,
                        userMessage: this.state.message
                    }

                    this.setState({message: ""})
                    this.props.callback(newResponse)
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
    render(){
        return (
            <div>
                <TextField 
                    className="TextField"
                    InputProps={{
                        className: this.props.classes.input
                    }}
                    value={this.state.message}
                    onChange={this.handleChange('message')}
                    onKeyDown={this.sendMessage}
                />
            </div>
        );
    }
}

export default withStyles(styles)(Chatbox);