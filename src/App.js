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
        console.log('call link', link);
        let id = this.props.id ? '/#' + this.props.id : '';


        // if (link === '/home') {
        //     window.history.pushState(null, null, '/home');
        //     ReactDOM.render(pages['/home'].component, document.getElementById('root'));
        // } else { // add id
        //     window.history.pushState(null, null, '/home/#1751295897__Odessa');
        //     ReactDOM.render(pages['/detail'].component, document.getElementById('root'));
        // }

        if ( link in pages ) {
            window.history.pushState(null, null, '/home' + id);
            ReactDOM.render(pages[link].component, document.getElementById('root'));
        }
    };

    render() {
        return (
            <button onClick={() => {
                this.route(this.state.link)
            }} key={this.state.name}>
                {this.state.name}
            </button>
        );
    }
}

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {items} = store.getState();

        return (
            <div>
                {/*<Link to={'/detail'} key={'Detail'} name={'Detail'}/>*/}
                <h3>Home</h3>

                {items.map(item => (
                    <Link to={'/home/:id'} id={item.id} key={item.label} name={item.label}/>
                    // <Link to={'/home/#' + item.id} key={item.label} name={item.label}/>
                ))}
            </div>
        )
    };
}


class Detail extends Component {
    constructor(props) {
        super(props);
    }

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

// class Home extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             // hash: window.location.hash
//         };
//     }
//
//
//     getItemById = (id, items) => {
//         let index = 0;
//
//         for (index; index < items.length; index++) {
//             console.log((items[index].id === id), items[index].id, id);
//             if (items[index].id === id) {
//                 return items[index];
//             }
//         }
//
//         return null;
//     };
//
//     render() {
//         let {items} = store.getState(),
//             hash = window.location.hash,
//             item, id;
//
//         console.log('hash: ' + hash);
//
//         if (hash) {
//             // get rid of hash symbol
//             id = hash.slice(1);
//
//             item = this.getItemById(id, items);
//
//             console.log('item: ', item);
//
//             if (item) {
//                 console.log('load detail');
//                 return <Detail mergeState={store.mergeState.bind(store)} id={id} item={item}/>
//             }
//         }
//
//         console.log('load home');
//
//         return (
//             <div>
//                 {items.map(item => (
//                     <Link to={'/home/#' + item.id} key={item.label} name={item.label}/>
//                 ))}
//             </div>
//         );
//     }
// }
//
//
// class Detail extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             id: props.id,
//             item: props.item
//         }
//     }
//
//     render() {
//         let item = this.state.item;
//
//         return (
//             <div>
//                 <Link to={'/home'} key={'Home'} name={'Home'}/>
//
//                 <h3>{item.id}</h3>
//                 <p>{item.type}</p>
//             </div>
//         )
//     };
// }


pages = {
    '/home': {
        component: <Home mergeState={store.mergeState.bind(store)}/>
    },
    '/home/:id': {
        component: <Detail mergeState={store.mergeState.bind(store)}/>
    },

};

function changeUrl ( path ) {
    window.history.pushState(null, null, path);
}

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
        let pathname = window.location.pathname,
            page = <p>Page not found...</p>,
            hash = window.location.hash,
            pageName;

        const {error, isLoaded} = this.state;

        // console.log(window.location)
        store.mergeState.call(store, this.state);

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            pathname = (pathname === '/') ? pathname : pathname.replace(/\/$/, "");

            console.log('pathname: ', pathname);
            console.log('hash: ', hash);

            if (pathname === '/home' && hash) {
                changeUrl(pathname + '/' + hash);
                page = pages['/home/:id'].component;
            } else {
                if (pathname === '/') {
                    pageName = '/home';
                    changeUrl(pageName);
                    page = pages[pageName].component;
                } else if (pathname in pages) {
                    page = pages[pathname].component;
                }
            }
        }

        return (page);
    }
}

export default App;
