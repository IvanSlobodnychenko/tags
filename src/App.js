import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom";
// import Tag from './components/tag';
import Store from './store';


var url = 'https://gist.githubusercontent.com/snownoop/e6ca04705cf03cbe6ef9beaf16a306ab/raw/07906333730ca961a8091a8c16b05d26a8ee7cd9/Tags%2520Cloud%2520Data',
    store = new Store(),
    pages;


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


class Link extends Component {
    constructor(props) {
        super(props);
        this.state = {
            link: props.to,
            name: props.name
        }
    }

    route = (link) => {
        window.history.pushState(null, null, link);
        ReactDOM.render(pages['/home'].component, document.getElementById('root'));
    };

// <Link to={'/home/#' + item.id} text={item.label}/>


    render() {
        return (
            <button onClick={() => { this.route(this.state.link) }} key={this.state.name}>
                {this.state.name}
            </button>
        );
    }
}


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // hash: window.location.hash
        };
    }

    getItemById = (id, items) => {
        let index = 0;

        for (index; index < items.length; index++) {
            console.log((items[index].id === id), items[index].id, id);
            if (items[index].id === id) {
                return items[index];
            }
        }

        return null;
    };

    render() {
        let {items} = store.getState(),
            hash = window.location.hash,
            item, id;

        console.log('hash: ' + hash);
        if (hash) {
            // get rid of hash symbol
            id = hash.slice(1);

            item = this.getItemById(id, items);

            console.log('item: ', item);

            if (item) {
                console.log('load detail');
                return <Detail mergeState={store.mergeState.bind(store)} id={id} item={item}/>
            }
        }

        console.log('load home');

        return (
            <div>
                {items.map(item => (
                    <Link to={'/home/#' + item.id} key={item.label} name={item.label}/>
                ))}
            </div>
        );
    }
}


class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            item: props.item
        }
    }

    render() {
        let item = this.state.item;

        return (
            <div>
                <Link to={'/home'} name={'Home'}/>

                <h3>{item.id}</h3>
                <p>{item.type}</p>
            </div>
        )
    };
}

pages = {
    '/home': {
        component: <Home mergeState={store.mergeState.bind(store)}/>
    }
    // '/detail': {
    //     component: <Detail mergeState={store.mergeState.bind(store)}/>
    // },

};

class App extends Component {
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

    render() {
        let pathname = window.location.pathname.replace(/\/$/, ""),
            page = <p>Page not found...</p>;

        const {error, isLoaded} = this.state;

        store.mergeState.call(store, this.state);

        console.log(window.location);

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else if (pathname in pages) {
            page = pages[pathname].component;
        }

        return (page);

        // todo: redirect from '/' to '/home'
    }
}

export default App;
