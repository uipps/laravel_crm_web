import { useState, useEffect } from 'react';
import { useRequest } from 'umi'
import services from '@/services';
function toMap(list, name = 'name') {
  return list.map(item => ({
    value: item[name]
  }))
}
export default () => {
  const [country_id, setCountryId] = useState(null) // country_id
  const [zone_prov_name, SetZoneProvName] = useState(null) // zone_prov_name
  const [zone_city_name, SetZoneCityName] = useState(null) // zone_city_name
  const [zone_area_name, SetAreaName] = useState(null) // district_name
  const [currencyCode, setCurrencyCode] = useState(null)  // currency
  const StateList = {
    country_id: setCountryId,
    zone_prov_name: SetZoneProvName,
    zone_city_name: SetZoneCityName,
    zone_area_name: SetAreaName
  }
  const { data: countryData } = useRequest(services.queryCountry); // 异步加载国家
  const { data: provinceData, run: runProvince } = useRequest(services.queryProvince, { manual: true }); // 异步加载省份
  const { data: cityData, run: runCity } = useRequest(services.queryCity, { manual: true });  // 异步加载城市
  const { data: districtData, run: runDistrict } = useRequest(services.queryDistrict, { manual: true }); // 异步加载地区
  const { data: zipCodeData, run: runZipCode } = useRequest(services.queryZipCode, { manual: true });  // 异步加载邮编 

  useEffect(() => { 
    if(country_id && Array.isArray(countryData?.list)){
      let currency = countryData?.list?.find(country => country.id === Number(country_id))?.currency?.symbol;
      setCurrencyCode(currency);
    }
    country_id && runProvince({ country_id })
  }, [country_id])

  useEffect(() => {   
    if (country_id && zone_prov_name) {
      runCity({ country_id, state_name: zone_prov_name })
    }
  }, [zone_prov_name])

  useEffect(() => {
    if (country_id && zone_prov_name && zone_city_name) {
      runDistrict({ country_id, state_name: zone_prov_name, city_name: zone_city_name })
    }
  }, [zone_city_name])
  useEffect(() => {
    if (country_id && zone_prov_name && zone_city_name && zone_area_name) {
      runZipCode({ 
        country_id, 
        state_name: zone_prov_name, 
        city_name: zone_city_name,
        district_name: zone_area_name
      })
    }
  }, [zone_area_name])
  function setDepend(obj) {
    Object.keys(obj).forEach(key => {
      if (['country_id', 'zone_prov_name', 'zone_city_name', 'zone_area_name'].includes(key)) {
        StateList[key](obj[key])
      }
    })
  }
  return {
    currencyCode,
    country: countryData?.list ?? [],
    province: toMap(provinceData?.list ?? []),
    city: toMap(cityData ?.list ?? []),
    district: toMap(districtData?.list ?? []),
    zipCode: toMap(zipCodeData?.list ?? [], 'post_code'),
    setDepend
  };
};
