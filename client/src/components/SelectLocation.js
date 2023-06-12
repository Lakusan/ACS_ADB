import React, { useEffect } from 'react'
import { Dropdown } from 'semantic-ui-react'

 

let cityOptions = [
    { key: 'NA', value: 'NA', text: 'Not available' },
]

 

const SelectLocation = (props) => {
    useEffect(() => {
        if (props.airportData) {
            const cities = props.airportData.map((item) => {
                return {
                    key: item.IATA,
                    value: item.IATA,
                    text: `${item.City} (${item.IATA})`
                }
            })
            cityOptions = cities
        }
    }, [props.airportData])

 

    const onValueChange = (e, { value }) => props.sendVal(value)

 

    return (
<Dropdown
            placeholder='Select City'
            fluid
            search
            selection
            options={cityOptions}
            onChange={onValueChange}
        />
    )
}

 

export default SelectLocation