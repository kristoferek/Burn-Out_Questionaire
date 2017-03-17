import React from 'react';
import ReactDOM from 'react-dom';
import {Questionaire} from './questionaire.jsx';

import './style.scss';

// Component header static
class Header extends React.Component{
    render(){
        return <div className="raw header">
            <div className="col-xs-12 col-sm-12">
                <h1 className="title text-center text-uppercase">
                    Burn-Out Questionaire
                </h1>
            </div>
        </div>
    }
}

// Component footer static
class Footer extends React.Component{
    render(){
        return <div className="raw footer">
            <div className="col-xs-12 col-sm-12 text-right">
                <a href="mailto:Krzysztof.Michal.Nowak@gmail.com">
                    &copy; Krzysztof Michał Nowak
                </a>
            </div>
        </div>
    }
}

// Comopose page
export class Template extends React.Component{
    constructor(props) {
        super(props)
    }

    render(){
        return <div className="container">
            <Header />
            <Questionaire/>
            <Footer />
        </div>
    }
}
