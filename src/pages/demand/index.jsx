import React, { Component, Fragment } from 'react'
import CustomBtn from '@/components/commonUseModule/customBtn'
import CreateDemand from './components/createModal'
class Demand extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visibleModal: false,
            modalTitle: '创建需求',
        }
    }

    handleViewModal = (bool, title, record = {}) => {
        this.setState({
            visibleModal: bool,
            modalTitle: title,
        })
    }

    render() {
        const { visibleModal, modalTitle } = this.state
        const createModalProps = {
            visibleModal,
            modalTitle,
            handleViewModal: this.handleViewModal
        }
        return (
            <Fragment>
                <CreateDemand {...createModalProps} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <CustomBtn
                        onClick={() => this.handleViewModal(true, '新建')}
                        type='create'
                        title='创建需求'
                    />
                    <div>
                        <CustomBtn
                            // onClick={() => this.handleViewModal(true, '新建')}
                            type='export' />
                    </div>

                </div>
            </Fragment>

        )
    }
}

export default Demand