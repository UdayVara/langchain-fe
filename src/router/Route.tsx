import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import DynamicPrompt from '../pages/DynamicPrompt'

export function RoutesConfig() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/dynamic-prompt' element={<DynamicPrompt />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Route