import React from "react"
import { Link } from "react-router-dom"
import "./NavBar.css"

interface Props {

}

interface State {

}

export default class NavBar extends React.Component<Props, State> {

    render() {
        return (
            <div id="header">
                <Link to="/heroes">
                    <div id="title" className="header-container">
                        <h1>Tour of Heroes</h1>
                    </div>
                </Link>
                <div className="header-container">
                    <nav>
                        <Link to="/heroes">Heroes</Link>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/heroes/add">+ Hero</Link>
                    </nav>
                </div>
            </div>
        );
    }
}