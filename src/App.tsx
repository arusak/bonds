import React, { useEffect, useState } from 'react';
import './App.scss';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BondViewModel, makeBondViewModel } from './models/bond.view-model';
import { getBonds } from './services/bonds.service';

function App() {
    const [list, setList] = useState<BondViewModel[]>([]);

    useEffect(() => {
        // load bonds and make view models
        getBonds().then(bonds => setList(bonds.map(makeBondViewModel)));
    }, []);

    return (
        <div className="App">
            <DashboardComponent list={list}/>
        </div>
    );
}

export default App;
