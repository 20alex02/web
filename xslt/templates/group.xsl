<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="group">
    {
    "id": <xsl:value-of select="@id"/>,
    "groupname": "<xsl:value-of select="groupname"/>",
    "description": "<xsl:value-of select="description"/>",
    "members": [
        <xsl:apply-templates select="members/member"/>
    ],
    "posts": [
        <xsl:apply-templates select="posts/post"/>
    ]
    }<xsl:if test="position()!=last()">,</xsl:if>
    </xsl:template>

    <xsl:template match="member">
    {
    "id": <xsl:value-of select="@id"/>,
    "username": "<xsl:value-of select="@username"/>"
    }<xsl:if test="position()!=last()">,</xsl:if>
    </xsl:template>

    <xsl:template match="post">
    {
    "id": "<xsl:value-of select="@id"/>",
    "sent": "<xsl:value-of select="@sent"/>",
    "reply_to": <xsl:choose>
                    <xsl:when test="@reply_to">"<xsl:value-of select="@reply_to"/>"</xsl:when>
                    <xsl:otherwise>null</xsl:otherwise>
                </xsl:choose>,
    "post": "<xsl:value-of select="normalize-space()"/>"
    }<xsl:if test="position()!=last()">,</xsl:if>
    </xsl:template>

</xsl:stylesheet>