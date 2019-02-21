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
                    items: data
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

                    <Redirect from="/" to="/home" />
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
        let {items} = store.getState();

        return (
            <div>
                <h3>Home Page</h3>

                {items.map(item => (
                    <button
                        className={'tag-button'}
                        style={{fontSize: item.sentimentScore > 1 ? item.sentimentScore * 0.4 : 12}}
                        key={item.id}>
                        <Link to={`${this.props.match.url}/${item.id}`}>{item.label}</Link>
                    </button>
                ))}
            </div>
        )
    };
}


class Detail extends Component {
    getItemById = (id, items) => {
        let index = 0;

        for (index; index < items.length; index++) {
            if (items[index].id === id) {
                return items[index];
            }
        }

        return null;
    };

    render() {
        let {items} = store.getState(),
            item = this.getItemById(this.props.match.params.id, items);

        if (item) {
            return (
                <div>
                    <h3 key={item.label}>{item.label}</h3>

                    <ul>
                        <li key={'total'}>total props: {Object.keys(item).length - 1}</li>
                    </ul>

                    <ul>
                        {Object.keys(item.sentiment).map(key => (
                            <li key={key}>{key}: {item.sentiment[key]}</li>
                        ))}
                    </ul>

                    <ul>
                        {Object.keys(item.pageType).map(key => (
                            <li key={key}>{key}: {item.pageType[key]}</li>
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
