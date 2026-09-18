import CompanionProductPage from '../components/CompanionProductPage';
import { resetProduct } from '../config/commerce';

export default function ResetProductPage() {
  return <CompanionProductPage product={resetProduct} />;
}
