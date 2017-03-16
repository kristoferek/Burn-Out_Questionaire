import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import {questions} from './questions.js';

class TopContent  extends React.Component{
    render() {
        return <div className="raw top-content">
            <div className="col-xs-12 col-sm-5 title">
                <h1 className="text-right">
                    Where am I?
                </h1>
            </div>
            <div  className="col-xs-12 col-sm-7 description">
                <p>
                    Below you will find 15 statements regarding work related feelings and thoughts. If you consider the feeling mentioned below to have been dominant during the past month tick a checkbox.
                </p>
            </div>
        </div>
    }
}

class MainContent extends React.Component{
    constructor(props) {
        super(props);
        console.log('Questionaire constructor');
        this.state={
            displayResult: false,
            physicalScore: 0,
            mentalScore: 0,
            emotionalScore: 0,
            questionArr:[],
            activeIndex: 0
        }
    }

    makeQuestionArray = (question)=>{
        let arr = []

        for (var i = 0; i < questions.physical.length; i++) {
            arr.push({id: i,question: questions.physical[i].question, type: 'physical'});
        }
        for (var i = 0; i < questions.mental.length; i++) {
            arr.push({id: i + questions.mental.length,question: questions.mental[i].question, type: 'mental'});
        }
        for (var i = 0; i < questions.emotional.length; i++) {
            arr.push({id: i + questions.physical.length +  questions.mental.length, question: questions.emotional[i].question, type: 'emotional'});
        }
        this.setState({
            questionArr: arr
        })
    }

    componentWillMount() {
        this.makeQuestionArray(questions);
    }

    generateLi = (el, index) =>{
        console.log(el);
        return <li key={index}>
            <div className="question">
                <div>
                    <input type="checkbox"/> {el.question}

                </div>
            </div>

        </li>
    }

    render() {
        console.log(this.state.questionArr);
        return <div className="raw main-content">
            <div  className="col-xs-12 col-sm-12 poll">
                <ol>
                    {this.state.questionArr.map((el, index) => {
                        return this.generateLi(el, index)
                    })}
                </ol>
                <div>
                    <button className="btn btn-danger">Proceed</button>
                </div>
            </div>
        </div>
    }
}

export class Questionaire extends React.Component{
    render(){
        return <main className='questionaire'>
            <header>
                <TopContent />
            </header>
            <article>
                <MainContent />
            </article>
        </main>
    }
}
