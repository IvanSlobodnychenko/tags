import React, {Component} from 'react';
import ReactDOM from "react-dom";
import Store from './store';


let url = 'https://gist.githubusercontent.com/snownoop/e6ca04705cf03cbe6ef9beaf16a306ab/raw/07906333730ca961a8091a8c16b05d26a8ee7cd9/Tags%2520Cloud%2520Data',
    store = new Store(),
    history = [],
    index = -1,
    historyUsed = false,
    pages;


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
            <a href="false"  onClick={(e) => { e.preventDefault(); this.route(this.state.link)}} key={this.state.name}>
                {this.state.name}
            </a>
        );
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
                        <Link to={'/home/:id'} id={item.id} key={item.label} name={item.label}/>
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
                    <h3>Detail page</h3>

                    <ul>
                        <li key={item.label}>label: {item.label}</li>
                        <li key={'total'} >total props: {Object.keys(item).length - 1}</li>
                    </ul>

                    <ul>
                        {Object.keys(item.sentiment).map(key => (
                            <li key={key} >{key}: {item.sentiment[key]}</li>
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
                <Link to={'/home'} key={'Home'} name={'Home'}/>
                <h3>Detail Page</h3>
                <p>nothing to show</p>
            </div>
        )
    };
}


function loadHandle (path, component ) {
    // clean history more then current page index
    if ( historyUsed ) {
        history.splice(index + 1);
        historyUsed = false;
    }

    // change url without reloading
    window.history.pushState(null, null, path);

    // fill the history
    history.push({
        href: window.location.href,
        component: component
    });

    ++index;

    // console.log('currentIndex: ' + index, history);
}

pages = {
    '/': {
        component: <Home mergeState={store.mergeState.bind(store)}/>,
        load: function () {
            loadHandle('/home', this.component);

            return this.component;
        }
    },
    '/home': {
        component: <Home mergeState={store.mergeState.bind(store)}/>,
        load: function () {
            loadHandle('/home', this.component);

            return this.component;
        }
    },
    '/home/:id': {
        component: <Detail mergeState={store.mergeState.bind(store)}/>,
        load: function (path) {
            loadHandle(path, this.component);

            return this.component;
        }
    },
};


// main component
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getData = function (callback) {
        let xhr = new XMLHttpRequest();

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
            // default view
            page = <p>Page not found...</p>,
            pageName;

        store.mergeState.call(store, this.state);

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            // get rid of last slash
            pathname = (pathname === '/') ? pathname : pathname.replace(/\/$/, "");

            if (pathname in pages) {
                // change page name for pages with #id
                pageName = hash ? pathname + '/:id' : pathname;
                page = pages[pageName].load(pathname + '/' + hash);
            }
        }

        return (page);
    }
}


window.onpopstate = function () {
    let href = document.location.href;

    // if moving forward
    if (history[index + 1] && href === history[index + 1].href) {
        ReactDOM.render(history[++index].component, document.getElementById('root'));
    // if moving back
    } else if (history[index - 1] && href === history[index - 1].href) {
        ReactDOM.render(history[--index].component, document.getElementById('root'));
    }

    historyUsed = true;
};


export default App;
