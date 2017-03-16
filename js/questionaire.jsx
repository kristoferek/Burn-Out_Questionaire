import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import './jspdf.debug.js';
import {questions, results} from './questions.js';

// Display questions or result
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
            barClicked: false,
            buttonText: 'Proceed',
            DownloadText: 'Download PDF',
            resultDescription: ""
        }
    }
    // Initialise and structurise data by getting them from questions.js an putting to this.state.questionArr
    makeQuestionArray = (question)=>{
        let arr = [];

        for (let i = 0; i < questions.physical.length; i++) {
            arr.push({
                id: i,
                question: questions.physical[i].question,
                type: 'physical',
                checked: false
            });
        }
        for (let i = 0; i < questions.mental.length; i++) {
            arr.push({
                id: i + questions.mental.length,
                question: questions.mental[i].question,
                type: 'mental',
                checked: false
            });
        }
        for (let i = 0; i < questions.emotional.length; i++) {
            arr.push({
                id: i + questions.physical.length +  questions.mental.length,
                question: questions.emotional[i].question,
                type: 'emotional',
                checked: false
            });
        }
        this.setState({
            questionArr: arr
        })
        console.log(arr);
    }


    initialiseDescription = ()=>{
        this.setState({
            resultDescription: <div className="col-xs-12">
                    <p>
                        Burnout is a reaction to stress, which becomes obvious in emotional, mental and physical exhaustion.
                    </p>
                    <div className="alert alert-danger descripton" role="alert">
                        Click the bars above to see description and some advices.
                    </div>
                </div>
            });
    }

    // Data initialisation
    componentWillMount() {
        this.makeQuestionArray(questions);
        this.initialiseDescription();
    }

    // Display title and description of questionaire
    topContent  = () => {
        return <div className="raw top-content">
            <div className="col-xs-12 col-sm-5 title">
                <h1 className="text-right">
                    Where am I?
                </h1>
            </div>
            <div  className="col-xs-12 col-sm-7 description">
                <p> {this.state.displayResult
                    ?  "Thank you for answering questions. Beneath there are results showing factors that we hope will give some useful information about your conditions."
                    : "Below you will find 15 statements regarding work related feelings and thoughts. If you consider the feeling mentioned below to have been dominant during the past month tick a checkbox."}
                </p>
            </div>
        </div>
    }

    // When checkbox is slicked function updates physicalScore, mentalScore and emotionalScore
    updateScore = (index, isChecked)=> {
        switch (this.state.questionArr[index].type) {
            case 'physical':
                this.setState({
                    physicalScore: isChecked
                    ? this.state.physicalScore + 1
                    : this.state.physicalScore - 1
                })
            break;
            case 'mental':
                this.setState({
                    mentalScore: isChecked
                    ? this.state.mentalScore + 1
                    : this.state.mentalScore - 1
                })
            break;
            case 'emotional':
                this.setState({
                    emotionalScore: isChecked
                    ? this.state.emotionalScore + 1
                    : this.state.emotionalScore - 1
                })
            break;
            default:
        }
    }

    // Handle checkbox state change
    handleCheckbox = (event, el, index) => {
        // Make copy this.state.questionArr
        let copyArr = this.state.questionArr;

        // Change checked key value to oposite
        copyArr[index].checked = !el.checked;

        // Update scores
        this.updateScore(index, this.state.questionArr[index].checked);

        // Update this.state.questionArr
        this.setState({
            questionArr: copyArr
        })
        // console.log(this.state.questionArr[index]);
    }

    // Generates fields with question and checkbox
    generateLi = (el, index) =>{
        return <div key={index}  className="col-xs-12 col-sm-6">
            <div className="raw">
                <div className="col-xs-12 col-sm-12 question">
                    <div className = "text">
                        {el.question}
                    </div>
                    <div className="">
                        <section title=".slideThree">
                            <div className="slideThree">
                                <input type="checkbox" value="None" id={`slideThree${index}`} name="check" checked={el.checked} onChange={
                                    ()=>this.handleCheckbox(event, el, index)
                                } />
                            <label htmlFor={`slideThree${index}`}></label>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    }

    // Handles Proceed button - display results or go back to questions
    handleProceed=()=>{
        this.setState({
            buttonText: this.state.displayResult ? "Proceed" : "Go back",
            displayResult: !this.state.displayResult,
        })
        this.initialiseDescription();
    }

    progressBarrClass = (val) =>{
        if (val < 2) {
            return "progress-bar progress-bar-success"
        } else if (val < 3) {
            return "progress-bar progress-bar-warning"
        } else {
            return "progress-bar progress-bar-danger"
        }
    }

    generateDescription = (val, type)=>{
        if (val < 2) {
            this.setState({
                barClicked: true,
                resultDescription: <div className="col-xs-12 border">
                        <h3><strong>{`${type} exhaustion ${val*20}%`}</strong>{` - ${results.moderate.title}`}</h3>
                        <div className="description">{results.moderate.description}</div>
                    </div>
            })
        } else if (val < 3) {
            this.setState({
                barClicked: true,
                resultDescription: <div className="col-xs-12 border">
                        <h3><strong>{`${type} exhaustion ${val*20}%`}</strong>{` - ${results.average.title}`}</h3>
                        <div className="description">{results.average.description}</div>
                    </div>
            })
        } else {
            this.setState({
                barClicked: true,
                resultDescription: <div className="col-xs-12 border">
                        <h3><strong>{`${type} exhaustion ${val*20}%`}</strong>{` - ${results.critical.title}`}</h3>
                        <div className="description">{results.critical.description}</div>
                    </div>
            })
        }
    }

    generateProgressBars = ()=>{
        return <section>

            <div className="raw">
                <div className="col-xs-12 col-sm-3 hidden-xs">
                    <em className="">State</em>
                </div>
                <div className="col-xs-12 col-sm-9 hidden-xs">
                    <em className="">Condition</em>
                </div>
            </div>

            <div className="raw">
                <div className="col-xs-12 col-sm-3">
                    <strong className="text-uppercase">physical</strong><br/>
                </div>
                <div className="col-xs-12 col-sm-9 visual" onClick={()=>this.generateDescription(this.state.physicalScore, 'Physical')}>

                    <div className="progress">
                        <div className={this.progressBarrClass(this.state.physicalScore)} role="progressbar" aria-valuenow={this.state.physicalScore} aria-valuemin="0" aria-valuemax="5" style={{width: `${this.state.physicalScore*20}%`}}>
                            <span>
                                {this.state.physicalScore*20}%
                            </span>
                        </div>
                    </div>

                </div>
            </div>
            <div className="raw">
                <div className="col-xs-12 col-sm-3">
                    <strong className="text-uppercase">mental</strong><br/>
                </div>
                <div className="col-xs-12 col-sm-9 visual" onClick={()=>this.generateDescription(this.state.mentalScore, 'Mental')}>

                    <div className="progress">
                        <div className={this.progressBarrClass(this.state.mentalScore)} role="progressbar" aria-valuenow={this.state.mentalScore} aria-valuemin="0" aria-valuemax="100" style={{width: `${this.state.mentalScore*20}%`}}>
                            <span>{this.state.mentalScore*20}%</span>
                          </div>
                    </div>

                </div>
            </div>
            <div className="raw ">
                <div className="col-xs-12 col-sm-3">
                    <strong className="text-uppercase">emotional</strong><br/>
                </div>
                <div className="col-xs-12 col-sm-9 visual" onClick={()=>this.generateDescription(this.state.emotionalScore, 'Emotional')}>

                    <div className="progress">
                        <div className={this.progressBarrClass(this.state.emotionalScore)} role="progressbar" aria-valuenow={this.state.emotionalScore} aria-valuemin="0" aria-valuemax="5" style={{width: `${this.state.emotionalScore*20}%`}}>
                            <span>{this.state.emotionalScore*20}%</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    }

    generateResult = () =>{
        // {this.generateDescription(this.state.barClicked, "")}
        return <div className="col-xs-12 results">
            {this.generateProgressBars()}
            {this.state.resultDescription}
        </div>
    }

    handlePDF = () => {
        const doc = new jsPDF();

        const test = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id eros turpis. Vivamus tempor urna vitae sapien mollis molestie. Vestibulum in lectus non enim bibendum laoreet at at libero. Etiam malesuada erat sed sem blandit in varius orci porttitor. Sed at sapien urna. Fusce augue ipsum, molestie et adipiscing at, varius quis enim. Morbi sed magna est, vel vestibulum urna. Sed tempor ipsum vel mi pretium at elementum urna tempor. Nulla faucibus consectetur felis, elementum venenatis mi mollis gravida. Aliquam mi ante, accumsan eu tempus vitae, viverra quis justo.\n\nProin feugiat augue in augue rhoncus eu cursus tellus laoreet. Pellentesque eu sapien at diam porttitor venenatis nec vitae velit. Donec ultrices volutpat lectus eget vehicula. Nam eu erat mi, in pulvinar eros. Mauris viverra porta orci, et vehicula lectus sagittis id. Nullam at magna vitae nunc fringilla posuere. Duis volutpat malesuada ornare. Nulla in eros metus. Vivamus a posuere libero.';

        const header = "Burnout test";
        const descriptions = [results.critical.title, results.critical.description, results.average.title, results.average.description, results.moderate.title, results.moderate.description];


        doc.setFontSize(48);
        doc.setFont("helvetica");
        doc.text(20, 30, header);

        doc.setFontSize(18);
        doc.setFont("courier");
        doc.setFontType("bold");
        doc.text(20, 50, 'Physical exhaustion: ' + (this.state.physicalScore*20) + '%');
        doc.text(20, 65, 'Mental exhaustion: ' + (this.state.mentalScore*20) + '%');
        doc.text(20, 80, 'Emotional exhaustion: ' + (this.state.emotionalScore*20) + '%');

        doc.setFontSize(16);
        doc.setFont("helvetica");
        doc.setFontType("bold");
        doc.text(20, 210, "0 - 20% " + results.moderate.title);
        doc.setFontSize(12);
        doc.setFont("helvetica");
        doc.setFontType("normal");
        doc.text(20, 225, doc.splitTextToSize(results.moderate.description, 170));

        doc.setFontSize(16);
        doc.setFont("helvetica");
        doc.setFontType("bold");
        doc.text(20, 150, "20% - 40% " + results.average.title);
        doc.setFontSize(12);
        doc.setFont("helvetica");
        doc.setFontType("normal");
        doc.text(20, 165, doc.splitTextToSize(results.average.description, 170));

        doc.setFontSize(16);
        doc.setFont("helvetica");
        doc.setFontType("bold");
        doc.text(20, 100, "40% - 100% " + results.critical.title);
        doc.setFontSize(12);
        doc.setFont("helvetica");
        doc.setFontType("normal");
        doc.text(20, 115, doc.splitTextToSize(results.critical.description, 170));

        doc.save('burnout.pdf');
    }

    // display questions or results basing on proceed button pressing
    render() {
        return <div className="raw main-content">
            <header>
                {this.topContent()}
            </header>
            <article>
                { this.state.displayResult
                    ? this.generateResult()
                    : this.state.questionArr.map((el, index) => {
                        return this.generateLi(el, index)
                    })
                }
                <div className="col-xs-12 buttons">
                    <button className="btn btn-danger btn-lg" onClick={this.handleProceed}>
                        {this.state.buttonText}
                    </button> &nbsp;
                    <button className={`btn btn-primary btn-lg ${this.state.displayResult ? "" : "disabled"}`} onClick={this.handlePDF}>
                        {this.state.DownloadText}
                    </button>
                </div>
            </article>
        </div>
    }
}

// Display questionaire with questions or results
export class Questionaire extends React.Component{
    render(){
        return <main className='questionaire'>
            <MainContent />
        </main>
    }
}
