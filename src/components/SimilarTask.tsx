import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DeliveryTask {
  id: string;
  name: string;
  created: string | Date;
  status: number;
  from: string;
  to: string;
  price: string;
}

export default function SimilarTasks() {
  // Données simulées - à remplacer par vos données réelles
  const tasks: DeliveryTask[] = [
    {
      id: '6807db9e26c40636bffbb31c',
      name: '1 Canapé',
      created: '2025-04-22T18:10:38',
      status: 0,
      from: '133 Avenue Félix Faure, Paris, France',
      to: '3 Place du Président Kennedy, Vanves, France',
      price: '60EUR'
    },
    {
      id: '6807ce9826c40636bffbb2e7',
      name: '1 canapé 2 places',
      created: '2025-04-22T17:15:04',
      status: 0,
      from: '51 Chemin de Labat, Angresse, France',
      to: 'Rue Vanderschrick 66, Saint-Gilles, Belgique',
      price: '132EUR'
    },
    {
      id: '6806a1c2d6930460f060a6e1',
      name: '1 Canapé',
      created: '2025-04-21T19:51:30',
      status: 0,
      from: 'Le, 50 Boulevard Paul Doumer, Le Cannet, France',
      to: '17 Cité Ramery, La Chapelle-d\'Armentières, France',
      price: '146EUR'
    },
    {
      id: '68061518926ab51da8fd3e50',
      name: '1 canapé',
      created: '2025-04-21T09:51:20',
      status: 0,
      from: '57150 Creutzwald, France',
      to: '31500 Toulouse, France',
      price: '191EUR'
    },
    {
      id: '68054696926ab51da8fd3ccb',
      name: '1 Canapé',
      created: '2025-04-21T07:52:17',
      status: 0,
      from: '65 Avenue de Ravanasse, Aix-en-Provence, France',
      to: 'Mitry-Mory, France',
      price: '137EUR'
    },
    {
      id: '67ffff875e2ed93455faf521',
      name: '1 Canapé',
      created: '2025-04-20T17:38:11',
      status: 0,
      from: '14 Rue Clairaut, Paris, France',
      to: '40 Avenue du Général Compans, Blagnac, France',
      price: '144EUR'
    },
    {
      id: '6804f2c4491b6743a3ff4a48',
      name: '1 Canapé',
      created: '2025-04-20T13:12:36',
      status: 0,
      from: 'Mondercange, Luxembourg',
      to: 'Montpellier, France',
      price: '200EUR'
    },
    {
      id: '6804ca21cd16643290a5a830',
      name: '1 Un canapé',
      created: '2025-04-20T10:19:13',
      status: 0,
      from: '5 Allée des Glaieuls, Fréjus, France',
      to: '103 Rue du Docteur Berthollet, Sallanches, France',
      price: '120EUR'
    }
  ];

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, 'PPPpp', { locale: fr });
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
      case 2:
        return <span className="badge bg-info">En cours</span>;
      case 4:
      case 6:
        return <span className="badge bg-warning">Livré</span>;
      default:
        return <span className="badge bg-secondary">Inconnu</span>;
    }
  };

  return (
    <section id="similar_tasks" className="container">
      <h2 className="text-center">Livraisons récentes : canapé</h2>
      <br />

      <div className="list-tasks">
        <div className="list-group">
          {tasks.map((task) => (
            <Link 
              key={task.id}
              href={`/tasks/transporter-${encodeURIComponent(task.name)}/${task.id}`}
              className="list-group-item list-group-item-action"
            >
              <div className="row">
                <div className="col-10 col-lg-4">
                  <div className="list-group-item-heading">{task.name}</div>
                  <small className="list-group-item-text d-none d-md-block">
                    Posté le <span>{formatDate(task.created)}</span>
                  </small>
                </div>
                <div className="col-2 col-lg-2">
                  {getStatusBadge(task.status)}
                </div>
                <div className="col-10 col-lg-5">
                  <p className="list-group-item-heading">
                    de <b>{task.from}</b> à <b>{task.to}</b>
                  </p>
                </div>
                <div className="col-2 col-lg-1 text-center">
                  <div className="list-group-item-heading">
                    {task.price}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-4">
          <Link className="btn btn-info btn-block" href="/list-tasks/livraison/meuble/canape">
            Voir les autres envois
          </Link>
          <br />
          <br />
        </div>
      </div>
    </section>
  );
}