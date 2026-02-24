import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'

export function RoutesConfig() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Route