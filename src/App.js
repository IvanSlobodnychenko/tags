import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom";
// import Tag from './components/tag';
import Store from './store';


var url = 'https://gist.githubusercontent.com/snownoop/e6ca04705cf03cbe6ef9beaf16a306ab/raw/07906333730ca961a8091a8c16b05d26a8ee7cd9/Tags%2520Cloud%2520Data',
    store = new Store();


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
        if (link in pages) {
            ReactDOM.render(pages[link].component, document.getElementById('root'));
        }
    };

    render() {
        return (
            <button onClick={() => { this.route(this.state.link)} } key={this.state.name}>{this.state.name}</button>
        );
    }
}


class Main extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {items} = store.getState();

        console.log('items', items);

        return (
            <div>
                <Link to={'/detail'} name={'Detail'} />

                <ul>
                    {items.map(item => (
                        <li key={item.id}>
                            {item.id} {item.label}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}


class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '1751295897__Odessa'
        };
    }

    componentDidMount() {
        console.log('DID')
        // this.props.mergeState(this.state);
    }

    getItemById = (id, items) => {
        let index = 0;

        for (index; index < items.length; index++) {
            if (items[index].id === id) {
                return items[index];
            }
        }
    };

    render() {
        const {items} = store.getState();
        console.log('render');
        let item = this.getItemById(this.state.id, items);

        return (
            <div>
                <Link to={'/'} name={'Main'}/>

                <h3>{this.state.id}</h3>
                <p>{item.type}</p>
            </div>
        )
    };
}

const pages = {
    '/': {
        component: <Main mergeState={store.mergeState.bind(store)}/>
    },
    '/detail': {
        component: <Detail mergeState={store.mergeState.bind(store)}/>
    }
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
        let pathname = window.location.pathname,
            page = pages['/'].component;

        const {error, isLoaded} = this.state;

        store.mergeState.call(store, this.state);

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            if (pathname in pages) {
                page = pages[pathname].component;
            }

            return (page);
        }
    }
}

export default App;

{/*<Router>*/
}
{/*<div>*/
}
{/*<ul>*/
}
{/*<li>*/
}
{/*<Link to="/">Home</Link>*/
}
{/*</li>*/
}
{/*/!*<li>*!/*/
}
{/*/!*<Link to="/tag-details">Tag Details</Link>*!/*/
}
{/*/!*</li>*!/*/
}
{/*</ul>*/
}

{/*<hr/>*/
}

{/*/!*<Route exact path="/" component={Home} />*!/*/
}
{/*<Route exact path="/" render={(props) => <Home {...props} mergeState={store.mergeState.bind(store)}/>}/>*/
}
{/*/!*<Route path="/tag-details/:id"*!/*/
}
{/*/!*render={(props) => <TagDetails {...props} mergeState={store.mergeState.bind(store)}/>}/>*!/*/
}
{/*/!*<Route exact path="/tag-details" render={() => <h3>Please select a tag.</h3>}/>*!/*/
}
{/*</div>*/
}
{/*</Router>*/
}

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
