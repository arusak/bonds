import React, { useEffect, useState } from 'react';
import './App.scss';
import { BondsListComponent } from './list-bonds/bonds-list.component';
import { getBonds } from './services/bonds.service';

function App() {
	const [list, setList] = useState<any[]>([]);
	useEffect(()=>{
		getBonds().then(setList);
	}, [])
	return (
		<div className="App">
			<BondsListComponent list={list} />
		</div>
	);
}

export default App;
