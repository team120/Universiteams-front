import React from 'react'

const Dropdown = (props: any) => (
    <div className="dropdown">
        <span className="label">
            <i className="fa-solid fa-link"></i> Social Links
        </span>
        <ul className="items">
            <li>
                <a href="">
                    <i className="fa-brands fa-github"></i> Github
                </a>
            </li>
            <li>
                <a href="">
                    <i className="fa-brands fa-instagram"></i> Instagram
                </a>
            </li>
            <li>
                <a href="">
                    <i className="fa-brands fa-discord"></i> Discord
                </a>
            </li>
            <li>
                <a href="">
                    <i className="fa-brands fa-youtube"></i> Youtube
                </a>
            </li>
        </ul>
    </div>
)

export default Dropdown
