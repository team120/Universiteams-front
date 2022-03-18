import React from 'react'

const BarLoader = () => {
    return (
        <div className="loader-container">
            <svg
                width="87"
                height="50"
                viewBox="0 0 87 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g id="loader_bars">
                    <g id="upperbar">
                        <rect id="r1" width="67" height="14" rx="7" fill="#dd571c" />
                    </g>
                    <g id="middlebar">
                        <rect id="r2" x="20" y="18" width="67" height="14" rx="7" fill="#cc5801" />
                    </g>
                    <g id="bottombar">
                        <rect id="r3" y="36" width="67" height="14" rx="7" fill="#893101" />
                    </g>
                </g>
            </svg>

            <p>Universiteams</p>
        </div>
    )
}

export default BarLoader
