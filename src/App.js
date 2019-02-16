import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
// import Tag from './components/tag';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

var url = 'https://gist.githubusercontent.com/snownoop/e6ca04705cf03cbe6ef9beaf16a306ab/raw/07906333730ca961a8091a8c16b05d26a8ee7cd9/Tags%2520Cloud%2520Data';


function getData(callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, false);

    xhr.send();

    if (xhr.status !== 200) {
        // console.log(xhr.status + ': ' + xhr.statusText);
        callback({message: xhr.status + ': ' + xhr.statusText});
    } else {
        // console.log(xhr.responseText);
        callback(null, xhr.responseText);
    }
}


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        getData((error, respondData) => {
            if (!error) {
                this.setState({
                    isLoaded: true,
                    items: JSON.parse(respondData)
                });
            } else {
                this.setState({
                    isLoaded: true,
                    error
                })
            }
        });
    }

    componentWillUnmount() {

    }

    render() {
        const {error, isLoaded, items} = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <ul>
                    {items.map(item => (
                        <li key={item.id}>
                            {item.id} {item.label}
                        </li>
                    ))}
                </ul>
            );
        }
    }
}


class TagDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id
        };
    }

    render() {
        return <div>
            <h3>{this.state.id}</h3>
        </div>
    };
}


const App = () => (
    <Router>
        <div>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/tag-details">Tag Details</Link>
                </li>
            </ul>

            <hr/>

            <Route exact path="/" component={Home}/>
            <Route path="/tag-details/:id" component={TagDetails}/>
            <Route exact path="/tag-details" render={() => <h3>Please select a tag.</h3>}/>
        </div>
    </Router>
);

export default App;


// class App extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }
//
//     componentDidMount() {
//         getData( ( error, respondData ) => {
//             if ( !error ) {
//                 this.setState({
//                     isLoaded: true,
//                     items: JSON.parse(respondData)
//                 });
//             } else {
//                 this.setState({
//                     isLoaded: true,
//                     error
//                 })
//             }
//         });
//     }
//
//     componentWillUnmount() {
//
//     }
//
//     render() {
//         const { error, isLoaded, items } = this.state;
//
//         if (error) {
//             return <div>Error: {error.message}</div>;
//         } else if (!isLoaded) {
//             return <div>Loading...</div>;
//         } else {
//             return (
//                 <ul>
//                     {items.map(item => (
//                         <li key={item.id}>
//                             {item.id} {item.label}
//                         </li>
//                     ))}
//                 </ul>
//             );
//         }
//     }
// }
//
// export default App;
