import React, { ReactNode } from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 16,
  },
  title: {
    fontSize: 32,
  },
  content: {
    fontSize: 32,
  },
})

interface PDFProps {
  children: ReactNode
}

const PDF: React.FC<PDFProps> = ({ children }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Universiteams</Text>
        <View style={styles.content}>{children}</View>
      </Page>
    </Document>
  )
}

export default PDF
