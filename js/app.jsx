import React from 'react';
import ReactDOM from 'react-dom';
import {Questionaire} from './questionaire.jsx';
import {Template} from './template.jsx';




document.addEventListener('DOMContentLoaded', function(){

    class App extends React.Component {
        render() {
            return <Template />;
        }
    }

    ReactDOM.render(
        <App />,
        document.getElementById('app')
    );
});
