import CompanionProductPage from '../components/CompanionProductPage';
import { dailyProduct } from '../config/commerce';

export default function DailyPage() {
  return <CompanionProductPage product={dailyProduct} />;
}
