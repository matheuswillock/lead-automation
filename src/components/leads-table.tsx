import OutputSearchLead from "@/domain/Dto/OutputSearchLead";

export default function LeadsTable({ leads }: { leads: OutputSearchLead }) {
  if (!leads || !leads.places || leads.places.length === 0) {
    return <div className="text-muted-foreground">Nenhum lead encontrado.</div>;
  }

  // Correção: use apenas o array simples
  const places = leads.places ?? [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="px-2 py-1">Nome</th>
            <th className="px-2 py-1">Endereço</th>
            <th className="px-2 py-1">Telefone</th>
            <th className="px-2 py-1">WhatsApp</th>
            <th className="px-2 py-1">Site</th>
            <th className="px-2 py-1">Nota</th>
            <th className="px-2 py-1">Categoria</th>
          </tr>
        </thead>
        <tbody>
          {places.map((place, idx) => (
            <tr key={`${place.cid ?? ''}-${idx}`}>
              <td className="border px-2 py-1">{place.title}</td>
              <td className="border px-2 py-1">{place.address}</td>
              <td className="border px-2 py-1">{place.phoneNumber || "-"}</td>
              <td className="border px-2 py-1">
                {place.phoneNumber ? (
                  <a
                    href={`https://wa.me/55${place.phoneNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    WhatsApp
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-2 py-1">
                {place.website ? (
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Site
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="border px-2 py-1">{place.rating ?? "-"}</td>
              <td className="border px-2 py-1">{place.category ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}