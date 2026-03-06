export function Feature({ icon, title, desc }: any) {
  return (
    <div className="space-y-4">
      <div className="mx-auto w-fit p-3 rounded-xl bg-muted">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
