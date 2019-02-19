import React, {Component} from 'react';
import './App.css';
import ReactDOM from "react-dom";
// import Link from './components/link';
import Store from './store';


var url = 'https://gist.githubusercontent.com/snownoop/e6ca04705cf03cbe6ef9beaf16a306ab/raw/07906333730ca961a8091a8c16b05d26a8ee7cd9/Tags%2520Cloud%2520Data',
    store = new Store(),
    history = [],
    index = 0,
    pages;


function changeUrl(path) {
    window.history.pushState(null, null, path);
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
        let id = this.props.id ? '/#' + this.props.id : '';

        if (link in pages) {
            ReactDOM.render(pages[link].load('/home' + id), document.getElementById('root'));
        }
    };

    render() {
        return (
            <button onClick={() => {this.route(this.state.link)}} key={this.state.name}>
                {this.state.name}
            </button>
        );
    }
}


class Home extends Component {
    render() {
        let {items} = store.getState();

        return (
            <div>
                <h3>Home</h3>

                {items.map(item => (
                    <Link to={'/home/:id'} id={item.id} key={item.label} name={item.label}/>
                ))}
            </div>
        )
    };
}


class Detail extends Component {
    // todo: delete cycle and refactor the items
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

        if (hash) {
            // get rid of hash
            id = decodeURI(hash.slice(1));
            item = this.getItemById(id, items);
        }

        if (item) {
            return (
                <div>
                    <Link to={'/home'} key={'Home'} name={'Home'}/>
                    <h3>Detail</h3>
                    <p>{item.id}</p>
                    <p>{item.label}</p>
                </div>
            )
        }

        return (
            <div>
                <Link to={'/home'} key={'Home'} name={'Home'}/>
                <h3>Detail</h3>
                <p>nothing to show</p>
            </div>
        )
    };
}


pages = {
    '/': {
        component: <Home mergeState={store.mergeState.bind(store)}/>,
        load: function () {
            changeUrl('/home');

            history.push({
                href: window.location.href,
                component: this.component
            });

            return this.component;
        }
    },
    '/home': {
        component: <Home mergeState={store.mergeState.bind(store)}/>,
        load: function () {
            changeUrl('/home');

            history.push({
                href: window.location.href,
                component: this.component
            });

            return this.component;
        }
    },
    '/home/:id': {
        component: <Detail mergeState={store.mergeState.bind(store)}/>,
        load: function (path) {
            changeUrl(path);

            history.push({
                href: window.location.href,
                component: this.component
            });

            return this.component;
        }
    },
};


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getData = function (callback) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, false);
        xhr.send();

        if (xhr.status !== 200) {
            callback({message: xhr.status + ': ' + xhr.statusText});
        } else {
            callback(null, xhr.responseText);
        }
    };

    componentDidMount() {
        this.getData((error, respondData) => {
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
        const {error, isLoaded} = this.state;

        let pathname = window.location.pathname,
            hash = window.location.hash,
            page = <p>Page not found...</p>,
            pageName;

        store.mergeState.call(store, this.state);

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            pathname = (pathname === '/') ? pathname : pathname.replace(/\/$/, "");

            if (pathname in pages) {
                pageName = hash ? pathname + '/:id' : pathname;
                page = pages[pageName].load(pathname + '/' + hash);
            }
        }

        return (page);
    }
}

window.onpopstate = function() {
    var href = document.location.href;

    if ( href === history[history.length - 1].href ) {
        ++index;
        ReactDOM.render(history[history.length - 1].component, document.getElementById('root'));
    } else {
        --index;
        ReactDOM.render(history[index].component, document.getElementById('root'));
    }
};


export default App;
