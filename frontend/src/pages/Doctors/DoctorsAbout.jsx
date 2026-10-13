const DoctorsAbout = ({ name, about, qualifications = [], experiences = [] }) => (
  <div className="space-y-8">
    <div><h3 className="text-xl font-bold mb-3">About {name}</h3><p className="text-textColor leading-7">{about || "No biography has been added yet."}</p></div>
    <div><h3 className="text-xl font-bold mb-3">Qualifications</h3>{qualifications.length ? <ul className="space-y-2">{qualifications.map((q, i) => <li key={i}>{q.degree || "Degree"} {q.university ? `— ${q.university}` : ""}</li>)}</ul> : <p className="text-textColor">No qualifications added.</p>}</div>
    <div><h3 className="text-xl font-bold mb-3">Experience</h3>{experiences.length ? <ul className="space-y-2">{experiences.map((e, i) => <li key={i}>{e.position || "Position"}{e.hospital ? ` — ${e.hospital}` : ""}</li>)}</ul> : <p className="text-textColor">No experience added.</p>}</div>
  </div>
);
export default DoctorsAbout;
