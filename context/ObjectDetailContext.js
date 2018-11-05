import React from 'react';

export const ObjectDetailContext = React.createContext({
	appId: '',
	resourceId: '',
	data: '',
	userCollections: [],
	roleList: [],
})