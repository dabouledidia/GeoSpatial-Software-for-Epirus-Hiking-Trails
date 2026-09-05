export interface TrailAnnotation {
  id: string;
  lng: number;
  lat: number;
  type: 'warning' | 'water' | 'obstacle' | 'weather' | 'closed' | 'viewpoint';
  title: string;
  description?: string;
  createdBy?: string;
  createdAt?: Date;
}

/** Shape sent to the backend when creating an annotation.
 *  id/createdAt/createdBy are assigned server-side — never trust
 *  client-supplied values for those (see AnnotationController). */
export type CreateTrailAnnotationRequest = Pick<
  TrailAnnotation,
  'lat' | 'lng' | 'type' | 'title' | 'description'
>;