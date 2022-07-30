import {useState} from 'react'
import {  PickUpFill, PickUpOutline, DeliveryFill, DeliveryOutline } from '../../assets/icons'

 const BtnTabs = () => {
    const [activeTab, setActiveTab] = useState('pick-up')

    const handleActiveTab = (name) => {
        setActiveTab(name)
    }
    
  return (
    <div className="tab__container">
    <div className="tab__wrapper">
        <button onClick={() => handleActiveTab('pick-up')} className={activeTab === 'pick-up' && "active"}>
        <span> {activeTab !== 'pick-up' ? <PickUpOutline /> : <PickUpFill />  } </span> <span>Pick up</span>
        </button>
        <button onClick={() => handleActiveTab('delivery')} className={activeTab === 'delivery' && "active"} >
        <span>{activeTab !== 'delivery' ? <DeliveryOutline /> : <DeliveryFill />  }</span> <span>Delivery</span>
        </button>
    </div>
</div>
  )
}

export default BtnTabs