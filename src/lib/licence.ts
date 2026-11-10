/** Prefix on enquiries sent from the "Request licence copies" form; the admin inbox tags them. */
export const LICENCE_REQUEST_TAG = '[Licence copy request]'

export const isLicenceRequest = (requirement: string) => requirement.startsWith(LICENCE_REQUEST_TAG)
