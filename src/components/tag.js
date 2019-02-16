import React, {Component} from 'react';


class Tag extends Component {
    render() {
        return (
            <div className="tag-list">
                <ul>
                    {this.props.items.map(item => (
                        <li key={item.id}>{item.text}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Tag;

// export class Timer extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { seconds: 0 };
//     }
//
//     tick() {
//         this.setState(state => ({
//             seconds: state.seconds + 1
//         }));
//     }
//
//     componentDidMount() {
//         this.interval = setInterval(() => this.tick(), 1000);
//     }
//
//     componentWillUnmount() {
//         clearInterval(this.interval);
//     }
//
//     render() {
//         return (
//             <div>
//                 Seconds: {this.state.seconds}
//             </div>
//         );
//     }
// }