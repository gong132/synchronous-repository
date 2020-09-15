

const Demand = {
    namespace: 'demand',
    state: {
        formType: 'list',
    },
    effects: {

    },
    reducers: {
        setData(state, {payload}) {
            return {
                ...state,
                ...payload,
            }
        }
    }
}

export default Demand