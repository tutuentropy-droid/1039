import { useParams, Navigate } from 'react-router-dom';
import { SchoolDetail } from '@/components/school/SchoolDetail';
import { dataService } from '@/services/dataService';

const SchoolDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const school = id ? dataService.getSchoolById(id) : undefined;

  if (!school) {
    return <Navigate to="/" replace />;
  }

  return <SchoolDetail school={school} />;
};

export default SchoolDetailPage;
