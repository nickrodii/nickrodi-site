const NavBar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 bg-black text-white p-4 z-50">
            <ul className="flex space-x-8">
                <li>
                    <a href="#about">about</a>
                </li>
                <li>
                    <a href="#projects">projects</a>
                </li>
                <li>
                    <a href="#contact">contact</a>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar;