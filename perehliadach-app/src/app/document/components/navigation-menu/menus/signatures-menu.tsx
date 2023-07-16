import { useActiveDocumentValue, useDocumentContext } from '@/app/document/scripts/document-context';
import { BaseNavigationMenu } from '../base-navigation-menu';
import { SignedDocumentContext } from '@/scripts/global-state/signed-document-context';
import { Text, Group, Paper, Badge, Box, Stack, Tooltip } from '@mantine/core';
import { IconCalendar, IconCertificate, IconFile, IconFileDescription, IconHelpCircle, IconSignature, IconWriting } from '@tabler/icons-react';
import { DocumentInScope, ParsedSimpleReport, ReportSignature } from '@/scripts/signature-validation/eu-dss/simple-report-parser';

const getSimpleReport = (context: SignedDocumentContext | null) => {
  if (context == null || context.validation == null || !('files' in context.validation)) {
    return null;
  }

  return context.validation.report;
};

function SignatureDocumentBox({ document }: { document: DocumentInScope }) {
  const activeDocument = useActiveDocumentValue();

  return (
    <Paper withBorder p='xs'>
      <Group spacing='xs'>
        <IconFile size='0.725rem' />
        <Box sx={{ maxWidth: '330px' }} mr='auto'>
          <Text truncate size='sm' fw={activeDocument && activeDocument.name === document.name ? '600' : 'normal'}>
            {document.name}
          </Text>
        </Box>
        <Badge size='sm' color='gray'>{document.scope}</Badge>
      </Group>
    </Paper>
  );
}

function SignatureBox({ signature }: { signature: ReportSignature }) {

  const signatureDate = signature.bestSignatureTime?.toLocaleDateString(
    'en-GB', 
    {
      day: '2-digit',
      year: 'numeric',
      month: '2-digit',
      hour: '2-digit',
      second: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <Paper withBorder p='xs'>
      <Group spacing='xs' mb='5px'>
        <IconSignature size='1rem' />
        <Box sx={{ maxWidth: '300px' }} mr='auto'><Text truncate size='sm' fw='600'>{signature.signedBy}</Text></Box>
        <Badge size='sm' color={signature.verified ? 'green' : 'red'}>{signature.verified ? 'Verified' : 'Invalid'}</Badge>
      </Group>
      {
        signature.bestSignatureTime &&
        <Group spacing='xs'>
          <IconCalendar size='1rem' strokeWidth={1.5} />
          <Box><Text truncate size='sm' fw='normal'>Signed on {signatureDate}</Text></Box>
          <Tooltip label='Lowest time at which there exists a proof of existence for the signature' position='bottom'>
            <IconHelpCircle size='1rem' />
          </Tooltip>
        </Group>
      }
      {
        signature.trustedCertificate &&
        <Group spacing='xs'>
          <IconCertificate size='1rem' strokeWidth={1.5} />
          <Box mr='auto'><Text truncate size='sm' fw='normal'>{signature.trustedCertificate}</Text></Box>
        </Group>
      }
      <Stack spacing='xs' mt='xs'>
        {
          signature.documents.map(
            document => 
              <SignatureDocumentBox key={document.name} document={document} />
          )
        }
      </Stack>
    </Paper>
  );
}

function ReportOverview({ report }: { report: ParsedSimpleReport }) {
  const validSignaturesCount = report.signatures.filter(s => s.verified).length;
  const signaturesCount = report.signatures.length;

  return (
    <Paper withBorder p='xs'>
      <Group spacing='xs' mb='xs'>
        <IconFileDescription size='1rem' />
        <Box sx={{ maxWidth: '300px' }} mr='auto'><Text truncate size='sm' fw='600'>Summary</Text></Box>
      </Group>
      <Text size='sm'>
        File <span style={{ fontWeight: 600 }}>{report.documentName}</span> ({report.containerType}) contains {validSignaturesCount} valid signature, out of {signaturesCount}. 
        The validation was performed in compliance with the <Tooltip multiline label={report.policy.description}><span style={{ fontWeight: 600 }}>{report.policy.name}</span></Tooltip> policy.
      </Text>
    </Paper>
  );
}

export function SignaturesMenu({ onClose }: { onClose: () => void }) {
  const [context] = useDocumentContext();
  const simpleReport = getSimpleReport(context);

  return (
    simpleReport == null ? null :
    <BaseNavigationMenu icon={IconWriting} title='Signatures' onClose={onClose}>
      <Stack spacing='xs'>
        <ReportOverview report={simpleReport!} />
        {
          simpleReport!.signatures.map(
            (signature: any, i: number) =>
              <SignatureBox key={i} signature={signature}/>
          )
        }
      </Stack>
    </BaseNavigationMenu>
  );
}