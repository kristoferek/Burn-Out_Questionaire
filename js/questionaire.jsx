import React from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import {questions, results} from './questions.js';

// Returns list of questions or result with title and buttons
class MainContent extends React.Component{
    constructor(props) {
        super(props);
        // console.log('Questionaire constructor');
        this.state={
            displayResult: false, // displays questions or result
            physicalScore: 0, // count checked questions of physical type
            mentalScore: 0, // count checked questions of mental type
            emotionalScore: 0, // count checked questions of emotional type
            questionArr:[], // questions
            buttonText: 'Proceed', // submit button text
            buttonIcon: 'bar-chart', // submit button icon
            DownloadText: 'Download PDF', // Download Text
            resultDescription: "", // desription under progressbars
            inputDisplay: false, // input display state
            inputName: "", // name to put in pdf
            inputAlertDisplay: false, // input alert state
            inputAlertMsg: " Type in your name (min 3 characters)"
        }
    }

    //  Randomize array element order in-place.
    // Using Durstenfeld shuffle algorithm.
    shuffleArray = (array) => {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
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
            questionArr: this.shuffleArray(arr)
        })
    }

    // Initialise description beteath progress bars this.state.resultDescription
    initialiseDescription = ()=>{
        this.setState({
            resultDescription: <div className="">
                <div className="col-xs-12 col-sm-6 col-md-8">
                    <p>
                        Burnout is a reaction to stress, which becomes obvious in emotional, mental and physical exhaustion. Burnout affects productivity and energy levels, leaving those affected increasingly helpless, hopeless, cynical, and resentful. Most people have days when we feel bored, overloaded, or unappreciated. If you feel like this most of the time, however, you may be experiencing burnout.
                    </p>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 border">
                    <i className="fa fa-arrow-up fa-3x fa-pull-left" aria-hidden="true"></i>
                    Click the bars above to see description and some advices.
                </div>
            </div>
        });
    }

    // DATA INITIALISATION - this.state.questionArr, this.state.resultDescription
    componentWillMount() {
        this.makeQuestionArray(questions);
        this.initialiseDescription();
    }

    // Returns page title and title description for questionaire and for results
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

    // When checkbox is clicked function updates physicalScore, mentalScore and emotionalScore
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

    // Handle checkbox - on change update this.state.scores and this.state.questionArr
    handleCheckbox = (event, el, index) => {
        // Make copy this.state.questionArr
        let copyArr = this.state.questionArr;

        // Change checked question key value to oposite
        copyArr[index].checked = !el.checked;

        // Update apropriate scores with checked question index
        this.updateScore(index, this.state.questionArr[index].checked);

        // Update question array this.state.questionArr
        this.setState({
            questionArr: copyArr
        })
    }

    // Generates and returns fields with questions from this.state.questionArr and checkboxes
    generateLi = (el, index) =>{
        return <div key={index}  className="col-xs-12 col-sm-6">
            <div className="raw">
                <div className="col-xs-12 col-sm-12 question">
                    <div className = "text pull-left">
                        {el.question}
                    </div>
                    <div className="slideThree pull-right">
                        <input type="checkbox" value="None" id={`slideThree${index}`} name="check" checked={el.checked} onChange={
                            ()=>this.handleCheckbox(event, el, index)
                        } />
                        <label htmlFor={`slideThree${index}`}></label>
                    </div>
                </div>
            </div>
        </div>
    }

    // Handles Proceed button state and text
    handleProceed=()=>{
        this.setState({
            buttonText: this.state.displayResult ? "Proceed" : "Go back",
            buttonIcon: this.state.displayResult ? "bar-chart" : "list",
            displayResult: !this.state.displayResult,
            inputDisplay: false,
            inputAlertDisplay: false
        })
        this.initialiseDescription();
    }

    // returns class setting appriopriate color for generated progress bar depending on given score (val)
    progressBarrClass = (val) =>{
        if (val < 2) {
            return "progress-bar progress-bar-success"
        } else if (val < 3) {
            return "progress-bar progress-bar-warning"
        } else {
            return "progress-bar progress-bar-danger"
        }
    }

    setStateResultDescription = (val, type, title, desc) =>{
        this.setState({
            barClicked: true,
            resultDescription: <div className="col-xs-12 border">
                <h3>
                    <strong>
                        <span  className="text-capitalize">
                            {`${type} `}
                        </span>
                        {`exhaustion ${val*20}%`}
                    </strong>
                    {` - ${title}`}
                </h3>
                <div className="description">
                    {desc}
                </div>
            </div>
        })
    }

    // Depending on score (val) updates this.state.resultDescription with customised header containing state (type), exhaustion level (val*20%), title and description
    updateStateResultDescription = (val, type)=>{
        if (val < 2) {
            this.setStateResultDescription(val, type, results.moderate.title, results.moderate.description);
        } else if (val < 3) {
            this.setStateResultDescription(val, type, results.average.title, results.average.description);
        } else {
            this.setStateResultDescription(val, type, results.critical.title, results.critical.description);
        }
    }

    // Return single progress bar with label
    generateSingleProgressBar = (score, label) => {
        return <div className="raw">
            <div className="col-xs-12 col-sm-3">
                <strong className="text-uppercase">{label}</strong><br/>
            </div>
            <div className="col-xs-12 col-sm-9 visual" onClick={()=>this.updateStateResultDescription(score, label)}>

                <div className="progress">
                    <div className={this.progressBarrClass(score)} role="progressbar" aria-valuenow={score} aria-valuemin="0" aria-valuemax="5" style={{width: `${score*20}%`}}>
                        <span>
                            {score*20}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    }

    // Return labels(hidden on small devices) and progress bars
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
            {this.generateSingleProgressBar(this.state.physicalScore, 'physical')}
            {this.generateSingleProgressBar(this.state.mentalScore, 'mental')}
            {this.generateSingleProgressBar(this.state.emotionalScore, 'emotional')}
        </section>
    }

    // Return progress brass with description beneath
    generateResult = () =>{
        // {this.generateDescription(this.state.barClicked, "")}
        return <div className="col-xs-12 results">
            {this.generateProgressBars()}
            {this.state.resultDescription}
        </div>
    }

    // Handle input with user name
    handleInput = (event) => {
        this.setState({
            inputName: event.target.value
        })
    }

    // Tun on input display state
    getName = () => {
        this.setState({
            inputDisplay: true
        })
    }

    // Validate input name - min 3 characters
    handlePDF = () => {
        if (this.state.inputDisplay) {
            if (this.state.inputName.length < 3){
                this.setState({
                    inputAlertDisplay: true,
                 })
            } else {
                this.setState({
                    inputAlertDisplay: false,
                    inputDisplay: false
                 });
                this.generatePDF();
            }
        } else {
            this.getName();
        }
    }

    // Generates result score in PDF
    generatePDF = () => {
        const doc = new jsPDF();

        const header = "Burn-out questionaire";
        const date = new Date();

        doc.setFontSize(48);
        doc.setFont("helvetica");
        doc.text(20, 30, header);

        doc.setFontSize(14);
        doc.setFont("courier");
        doc.setFontType("bold");
        doc.text(190, 40, date.toDateString(), null, null, 'right');

        doc.setFontSize(18);
        doc.setFont("courier");
        doc.setFontType("bold");
        doc.text(20, 60, "Your name:" + this.state.inputName);

        doc.setFontSize(18);
        doc.setFont("courier");
        doc.setFontType("bold");
        doc.text(20, 90, 'Physical exhaustion: ' + (this.state.physicalScore*20) + '%');
        doc.text(20, 105, 'Mental exhaustion: ' + (this.state.mentalScore*20) + '%');
        doc.text(20, 120, 'Emotional exhaustion: ' + (this.state.emotionalScore*20) + '%');

        doc.setFontSize(16);
        doc.setFont("helvetica");
        doc.setFontType("bold");
        doc.text(20, 150, "0 - 20% " + results.moderate.title);
        doc.setFontSize(12);
        doc.setFont("helvetica");
        doc.setFontType("normal");
        doc.text(20, 165, doc.splitTextToSize(results.moderate.description, 170));

        doc.setFontSize(16);
        doc.setFont("helvetica");
        doc.setFontType("bold");
        doc.text(20, 190, "20% - 40% " + results.average.title);
        doc.setFontSize(12);
        doc.setFont("helvetica");
        doc.setFontType("normal");
        doc.text(20, 205, doc.splitTextToSize(results.average.description, 170));

        doc.setFontSize(16);
        doc.setFont("helvetica");
        doc.setFontType("bold");
        doc.text(20, 250, "40% - 100% " + results.critical.title);
        doc.setFontSize(12);
        doc.setFont("helvetica");
        doc.setFontType("normal");
        doc.text(20, 265, doc.splitTextToSize(results.critical.description, 170));

        doc.save('burnout.pdf');
    }

    // returns Input field depending on this.state.inputDisplay and alert message
    generateInputName = ()=>{
        return <form>
            <div className={this.state.inputDisplay
                ? "col-sm-12 col-sm-6 name"
                : "col-sm-12 col-sm-6  hidden name"} >
                <input type="text" placeholder="type in your name" className="form-control" id="recipient-name" onChange={this.handleInput}/>
            </div>
            <div className="col-sm-12 col-sm-6 alert">
                {this.state.inputAlertDisplay
                     ? <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
                     : null}
                {this.state.inputAlertDisplay
                    ? this.state.inputAlertMsg
                    : null}
            </div>
        </form>
    }

    // returns buttons with set text depending on this.state.DownloadText and buttonText
    generateButtons = () =>{
        return <div className="col-xs-12 buttons">
            <button className="btn btn-danger btn-lg" type="button" onClick={this.handleProceed}>
                {this.state.buttonText}
                &nbsp;&nbsp;&nbsp;
                <i className={`fa fa-${this.state.buttonIcon}`} aria-hidden="true"></i>
            </button>
            &nbsp;&nbsp;&nbsp;
            <button className={`btn btn-primary btn-lg ${this.state.displayResult ? "" : "disabled"}`} type="button" onClick={this.handlePDF} disabled={!this.state.displayResult}>
                {this.state.DownloadText}
                &nbsp;&nbsp;&nbsp;
                <i className="fa fa-file-pdf-o" aria-hidden="true"/>
            </button>
        </div>
    }

    // display questions or results basing on button pressed
    render() {
        return <div className="raw main-content">
            <header>
                {this.topContent()}
            </header>
            <article>
                <div className="raw">
                    { this.state.displayResult
                        ? this.generateResult()
                        : this.state.questionArr.map((el, index) => {
                            return this.generateLi(el, index)
                        })
                    }
                </div>
                <div className="raw">
                    {this.generateInputName()}
                </div>
                <div className="raw">
                    {this.generateButtons()}
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
