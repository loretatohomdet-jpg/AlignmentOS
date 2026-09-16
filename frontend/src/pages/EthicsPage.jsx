import { type } from '../config/siteType';

export default function EthicsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <div>
        <p className={type.kicker}>Ethics & Boundaries</p>
        <h1 className={`mt-6 ${type.h1}`}>
          Alignment must remain free.
        </h1>
        <p className={`mt-4 ${type.body}`}>
          Alignment OS is designed to support coherence, not control. These boundaries are enforced at the product level.
        </p>
      </div>

      <ul className="mt-12 space-y-6 text-alignment-accent">
        {[
          { title: 'No monitoring', body: 'No individual surveillance. No hidden tracking.' },
          { title: 'No enforcement', body: 'No pressure mechanisms. No coercive compliance loops.' },
          { title: 'No data sales', body: 'Your personal data is not a product.' },
          { title: 'No institutional access to personal data', body: 'Aggregate insight only, never individual visibility.' },
        ].map((item) => (
          <li key={item.title}>
            <p className="font-medium">{item.title}</p>
            <p className={`mt-1 ${type.body}`}>{item.body}</p>
          </li>
        ))}
      </ul>

      <p className={`mt-12 ${type.body}`}>
        Alignment cannot be demanded. It must be invited.
      </p>
    </div>
  );
}

