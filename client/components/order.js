import React from 'react';
import { ERC20Abi, factoryABI } from '../config';
import { factoryAddress } from '../../address';
import axios from 'axios';
const BigNumber = require('bignumber.js');
// const { parseLog } = require('ethereum-event-logs');


export default class Order extends React.Component {
    constructor(props) {
        super(props);
        this.handleFillOrder = this.handleFillOrder.bind(this);
        this.handleExerciseOrder = this.handleExerciseOrder.bind(this);
    }

    componentDidUpdate() {
        console.log("order.js", this.props.data);
    }

    pow(input) {
        return new BigNumber(input).times(new BigNumber(10).pow(18)).toString();
    }

    handleFillOrder(e) {
        e.preventDefault();
        var premium = this.pow(parseFloat(this.props.data.premium));
        var tokenContract = new this.props.web3.eth.Contract(ERC20Abi, this.props.data.quoteTokenAddress);
        var factoryContract = new this.props.web3.eth.Contract(factoryABI, factoryAddress);
        var taker = this.props.web3.givenProvider.selectedAddress;
        tokenContract.methods.approve(factoryAddress.toString(), premium)
            .send({ from: taker }, (err, data) => {
                if (err) {
                    console.log("err", err);
                    window.alert("Allowance needs to be provided for the quote token to pay premium amount");
                }
                else {
                    factoryContract.methods.createOption(
                        this.props.data.maker,
                        taker,
                        this.pow(this.props.data.qty),
                        this.pow(this.props.data.strikePrice),
                        this.props.data.baseTokenAddress,
                        this.props.data.quoteTokenAddress,
                        premium,
                        new BigNumber(this.props.data.expiry).toString()
                    ).send({
                        from: taker,
                        gas: 4000000
                    }).then(receipt => {
                        console.log(receipt);
                        var id = receipt.events['idEvent'].returnValues[0];
                        window.alert(`Token id is ${id}`);
                        var data = this.props.data;
                        var obj = {
                            _id: data._id,
                            taker: taker,
                            tokenId: id
                        }
                        console.log(obj);
                        axios.post('http://localhost:5000/updateOrder', obj)
                            .then(res => {
                                console.log(res);
                            })

                    })
                }
            })
    }

    handleExerciseOrder(){
        
    }

    render() {
        return (
            <div>
                <h2>Order</h2>
                <p>Base Token:{this.props.data && this.props.data.baseToken}</p>
                <p>Quote Token:{this.props.data && this.props.data.quoteToken}</p>
                <p>Premium: {this.props.data && this.props.data.premium}</p>
                <p>Strike Price: {this.props.data && this.props.data.strikePrice}</p>
                <p>Expiry: {this.props.data && this.props.data.expiryString}</p>
                <p>Quantity: {this.props.data && this.props.data.qty}</p>
                {this.props.data &&
                    this.props.data.taker != this.props.web3.givenProvider.selectedAddress &&
                    <button onClick={this.handleFillOrder} className="btn btn-primary">Fill Order</button>}
                {this.props.data &&
                    this.props.data.taker == this.props.web3.givenProvider.selectedAddress &&
                    <button onClick={this.handleExerciseOrder} className="btn btn-primary">Exercise Order</button>}
            </div>
        )
    }
}