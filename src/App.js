import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect, Link} from "react-router-dom";
import Store from './store';


let store = new Store();


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        fetch('https://gist.githubusercontent.com/snownoop/e6ca04705cf03cbe6ef9beaf16a306ab/raw/07906333730ca961a8091a8c16b05d26a8ee7cd9/Tags%2520Cloud%2520Data')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    isLoaded: true,
                    tags: data
                });
            }).catch(error => {
            this.setState({
                isLoaded: true,
                error
            })
        });
    }

    render() {
        const {error, isLoaded} = this.state;

        store.mergeState.call(store, this.state);

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        }

        return (
            <Router>
                <div>
                    <ul>
                        <li>
                            <Link to="/home">Home</Link>
                        </li>
                    </ul>

                    <hr/>

                    <Redirect from="/" to="/home"/>
                    <Route exact path="/home"
                           render={(props) => <Home {...props} mergeState={store.mergeState.bind(store)}/>}/>
                    <Route path="/home/:id"
                           render={(props) => <Detail {...props} mergeState={store.mergeState.bind(store)}/>}/>
                </div>
            </Router>
        )
    }
}


class Home extends Component {
    render() {
        let {tags} = store.getState();

        return (
            <div>
                <h3>Home Page</h3>

                {tags.map(tag => (
                    <button
                        className={'tag-button'}
                        style={{fontSize: tag.sentimentScore > 1 ? tag.sentimentScore * 0.4 : 12}}
                        key={tag.id}>
                        <Link to={`${this.props.match.url}/${tag.id}`}>{tag.label}</Link>
                    </button>
                ))}
            </div>
        )
    };
}


class Detail extends Component {
    render() {
        let {tags} = store.getState(),
            tag = tags.find(item => item.id === this.props.match.params.id);

        if (tag) {
            return (
                <div>
                    <h3 key={tag.label}>{tag.label}</h3>

                    <ul>
                        <li key={'total'}>total props: {Object.keys(tag).length - 1}</li>
                    </ul>

                    <ul>
                        {Object.keys(tag.sentiment).map(key => (
                            <li key={key}>{key}: {tag.sentiment[key]}</li>
                        ))}
                    </ul>

                    <ul>
                        {Object.keys(tag.pageType).map(key => (
                            <li key={key}>{key}: {tag.pageType[key]}</li>
                        ))}
                    </ul>
                </div>
            )
        }

        return (
            <div>
                <p>Nothing to show...</p>
            </div>
        )
    }
}


export default App;
