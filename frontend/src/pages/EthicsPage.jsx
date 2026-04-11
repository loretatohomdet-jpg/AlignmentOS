export default function EthicsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <div className="rounded-2xl bg-alignment-surface border border-alignment-accent/10 p-8 sm:p-10 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-alignment-accent/6" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-alignment-accent/4" />
        </div>
        <div className="relative">
          <p className="text-xs font-medium text-alignment-accent/70 uppercase tracking-wider">Ethics & Boundaries</p>
          <h1 className="mt-2 text-headline font-semibold text-alignment-accent tracking-tight">
            Alignment must remain free.
          </h1>
          <p className="mt-4 text-alignment-accent/70 leading-relaxed">
            Alignment OS is designed to support coherence, not control. These boundaries are enforced at the product level.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple p-6 sm:p-8">
        <ul className="space-y-4 text-alignment-accent">
          {[
            { title: 'No monitoring', body: 'No individual surveillance. No hidden tracking.' },
            { title: 'No enforcement', body: 'No pressure mechanisms. No coercive compliance loops.' },
            { title: 'No data sales', body: 'Your personal data is not a product.' },
            { title: 'No institutional access to personal data', body: 'Aggregate insight only, never individual visibility.' },
          ].map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-alignment-accent/40 shrink-0" aria-hidden />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-0.5 text-sm text-alignment-accent/70">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-sm text-alignment-accent/70">
        Alignment cannot be demanded. It must be invited.
      </p>
    </div>
  );
}

