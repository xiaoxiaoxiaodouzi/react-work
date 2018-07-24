import React,{createContext } from 'react';

export const GlobalHeaderContext=React.createContext({
    currentUser: {},
    currentTenant: {},
    currentEnvironment: {},
    tenants: [],
    environments: [],
})