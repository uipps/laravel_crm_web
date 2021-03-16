import { useRequest } from 'umi'
import services from '@/services';

export default () => {
  let { data: language } = useRequest(services.queryLangs); // 异步加载语言
  let { data: country } = useRequest(services.queryCountry) // 异步加载国家

  const { run: makeCall } = useRequest(services.makeCall, {
    manual: true
  }); // 拨打电话

  return {
    makeCall,
    language: language?.list ?? [],
    country: country?.list ?? [],
  };
};
